const apiBaseUrl = new URL("http://localhost:3000");
const runId = crypto.randomUUID().slice(0, 8);
const password = "OrbitTest123!";
const demoUsers = [
  { name: "Ana Prueba", localPart: "ana" },
  { name: "Bruno Demo", localPart: "bruno" },
  { name: "Carla QA", localPart: "carla" },
  { name: "Diego Test", localPart: "diego" },
  { name: "Elena Demo", localPart: "elena" },
  { name: "Felipe QA", localPart: "felipe" },
  { name: "Gabriela Prueba", localPart: "gabriela" },
  { name: "Hugo Demo", localPart: "hugo" },
  { name: "Irene QA", localPart: "irene" },
  { name: "Javier Prueba", localPart: "javier" },
  { name: "Lucia Demo", localPart: "lucia" },
  { name: "Mateo QA", localPart: "mateo" },
];

const taskTitles = [
  "Preparar datos de prueba",
  "Revisar el flujo de inicio de sesion",
  "Validar permisos del workspace",
  "Actualizar documentacion interna",
  "Probar la vista de proyectos",
  "Revisar notificaciones",
  "Validar estados de tareas",
  "Preparar resumen semanal",
  "Revisar experiencia de usuario",
  "Comprobar accesibilidad",
  "Verificar comportamiento en movil",
  "Organizar pendientes del equipo",
];
const statuses = ["todo", "in_progress", "done"];
const priorities = ["low", "medium", "high", "urgent"];
const projects = [
  { name: "Proyecto Demo Alfa", key: "D01" },
  { name: "Proyecto Demo Beta", key: "D02" },
  { name: "Proyecto Demo Gamma", key: "D03" },
];
const workspaceNames = ["Workspace Demo Norte", "Workspace Demo Sur"];
const tasksPerProject = 12;

async function request(path, options = {}) {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.cookie) headers.set("Cookie", options.cookie);

  const response = await fetch(new URL(path.replace(/^\/+/, ""), apiBaseUrl), {
    method: options.body === undefined ? "GET" : "POST",
    headers,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText} en ${path}: ${responseText}`,
    );
  }

  const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
  return {
    data: responseText ? JSON.parse(responseText) : undefined,
    cookie,
  };
}

async function main() {
  console.log(`Conectando con la API: ${apiBaseUrl.origin}`);
  console.log(`Creando ${demoUsers.length} usuarios de prueba...`);

  const users = [];

  for (const demoUser of demoUsers) {
    const email = `orbit-demo-${runId}-${demoUser.localPart}@example.test`;
    const result = await request("auth/register", {
      body: { name: demoUser.name, email, password },
    });

    if (!result.cookie) {
      throw new Error(`El registro de ${email} no devolvió la cookie de sesión.`);
    }

    users.push({ user: result.data.user, cookie: result.cookie });
    console.log(`Usuario creado: ${email}`);
  }

  const owner = users[0];
  if (!owner) throw new Error("No se pudo crear el usuario propietario.");

  console.log(`Creando ${workspaceNames.length} workspaces...`);
  const workspaces = [];
  for (const name of workspaceNames) {
    const result = await request("workspaces", {
      cookie: owner.cookie,
      body: { name: `${name} ${runId}` },
    });
    workspaces.push(result.data.workspace);
  }

  const taskCount = workspaces.length * projects.length * tasksPerProject;
  console.log(
    `Creando ${projects.length} proyectos por workspace y ${taskCount} tareas en total...`,
  );
  for (const workspace of workspaces) {
    for (const project of projects) {
      await request(`workspaces/${workspace.slug}/projects`, {
        cookie: owner.cookie,
        body: {
          ...project,
          description: `Datos de prueba generados para ${project.name}.`,
        },
      });

      for (let index = 0; index < tasksPerProject; index++) {
        const assignee = users[index % users.length];
        const dueDate = new Date(Date.now() + (index + 1) * 86_400_000);
        await request(
          `workspaces/${workspace.slug}/projects/${project.key}/tasks`,
          {
            cookie: owner.cookie,
            body: {
              title: `${taskTitles[index]} (${project.key})`,
              description: `Tarea de prueba ${index + 1} para ${project.name}.`,
              status: statuses[index % statuses.length],
              priority: priorities[index % priorities.length],
              assigneeId: assignee.user.id,
              dueDate: dueDate.toISOString(),
            },
          },
        );
      }
    }

    console.log(
      `  ${workspace.name}: ${projects.length} proyectos, ${projects.length * tasksPerProject} tareas`,
    );
  }

  const pendingInvitations = [];
  console.log(
    `Enviando ${workspaces.length * (users.length - 1)} invitaciones...`,
  );
  for (const workspace of workspaces) {
    for (const member of users.slice(1)) {
      const invitationResult = await request(
        `workspaces/${workspace.slug}/invitations`,
        {
          cookie: owner.cookie,
          body: { email: member.user.email, role: "member" },
        },
      );
      const invitationPath = new URL(
        invitationResult.data.invitation.url,
        apiBaseUrl,
      ).pathname;
      pendingInvitations.push({ member, invitationPath });
    }
  }

  console.log("Aceptando las invitaciones con la sesión de cada usuario...");
  for (const { member, invitationPath } of pendingInvitations) {
    await request(`${invitationPath}/accept`, {
      cookie: member.cookie,
      body: {},
    });
  }

  console.log("Verificando sesiones y membresías...");
  for (const { user, cookie } of users) {
    await request("auth/me", { cookie });
    const result = await request("workspaces", { cookie });
    for (const workspace of workspaces) {
      if (
        !result.data.workspaces.some(
          (item) => item.slug === workspace.slug,
        )
      ) {
        throw new Error(
          `${user.email} no aparece como miembro de ${workspace.name}.`,
        );
      }
    }
  }

  console.log("\n✅ CARGA COMPLETADA CON ÉXITO");
  console.log("Workspaces:");
  for (const workspace of workspaces) {
    console.log(`  ${workspace.name}: ${workspace.slug}`);
  }
  console.log(`Usuarios: ${users.length}`);
  console.log(`Proyectos: ${workspaces.length * projects.length}`);
  console.log(`Tareas: ${taskCount}`);
  console.log("Credenciales de prueba (misma contraseña para todos):");
  for (const { user } of users) console.log(`  ${user.email}`);
  console.log(`  Contraseña: ${password}`);
  console.log("\nCada cuenta tiene una sesión independiente activa.");
}

main().catch((error) => {
  console.error("No se pudo completar la carga de datos:", error);
  throw error;
});
