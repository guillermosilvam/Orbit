import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCode from "react-qr-code";
import { Check, Copy, QrCode, X } from "lucide-react";
import {
  createInvitationSchema,
  type CreateInvitationInputDto,
} from "@orbit/shared/schemas/workspace.schema";
import type { CreatedInvitationDto } from "@orbit/shared/types/responses";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useCreateInvitation } from "../hooks/use-create-invitation";
import { ApiError } from "../../../shared/lib/api-client";
import { formatWorkspaceRole } from "../../workspaces/lib/format-role";


const formSchema = createInvitationSchema.extend({
  expiresInHours: z.number().int().min(1).max(720).optional(),
});
type FormData = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
};

export function CreateInvitationDialog({
  open,
  onClose,
  workspaceSlug,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "member",
      email: undefined,
      expiresInHours: 168,
    },
  });
  const create = useCreateInvitation(workspaceSlug);
  const [result, setResult] = useState<CreatedInvitationDto | null>(null);

  useEffect(() => {
    if (!open) {
      setResult(null);
      form.reset();
      create.reset();
    }
    
  }, [open]);

  if (!open) return null;

  const onSubmit = form.handleSubmit((data) => {
    
    
    const payload: CreateInvitationInputDto = {
      role: data.role,
      expiresInHours: data.expiresInHours,
      ...(data.email?.trim() ? { email: data.email.trim() } : {}),
    };
    create.mutate(payload, { onSuccess: (inv) => setResult(inv) });
  });

  const serverError =
    create.error instanceof ApiError
      ? create.error.message
      : create.error?.message;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-title"
    >
      <div
        className="bg-card border border-border w-full max-w-md p-6 animate-[slideUp_200ms_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h2
            id="invite-title"
            className="text-lg font-semibold text-foreground"
          >
            {result ? "Invitación creada" : "Nueva invitación"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        {!result && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Genera un enlace para invitar a alguien a este espacio de trabajo.
            </p>

            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <Field
                label="Rol"
                error={form.formState.errors.role?.message}
                required
              >
                <select
                  className="h-10 w-full border border-border bg-card px-3 font-sans text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring"
                  {...form.register("role")}
                >
                  <option value="member">{formatWorkspaceRole("member")}</option>
                  <option value="admin">{formatWorkspaceRole("admin")}</option>
                </select>
              </Field>

              <Field
                label="Email (opcional)"
                error={form.formState.errors.email?.message}
              >
                <Input
                  type="email"
                  placeholder="persona@equipo.com"
                  {...form.register("email")}
                />
              </Field>
              <p className="-mt-2 text-[11px] text-muted-foreground">
                Si especificas un email, solo esa persona podrá aceptar.
              </p>

              <Field
                label="Expira en (horas)"
                error={form.formState.errors.expiresInHours?.message}
              >
                <Input
                  type="number"
                  min={1}
                  max={720}
                  {...form.register("expiresInHours", {
                    setValueAs: (v: string) =>
                      v === "" ? undefined : Number(v),
                  })}
                />
              </Field>

              {serverError && (
                <p role="alert" className="text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" loading={create.isPending}>
                  {create.isPending ? "Creando…" : "Crear invitación"}
                </Button>
              </div>
            </form>
          </>
        )}

        {result && <InvitationResult invitation={result} onDone={onClose} />}
      </div>
    </div>
  );
}

function InvitationResult({
  invitation,
  onDone,
}: {
  invitation: CreatedInvitationDto;
  onDone: () => void;
}) {
  const fullUrl = `${window.location.origin}${invitation.url}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia este link:", fullUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="border border-destructive/40 bg-destructive/5 p-3">
        <p className="text-xs text-destructive font-medium">
          ⚠ Este enlace se muestra una sola vez. Cópialo ahora.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Enlace de invitación
        </label>
        <div className="flex gap-px bg-border border border-border">
          <input
            readOnly
            value={fullUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 min-w-0 bg-card px-3 py-2 font-mono text-xs text-foreground outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-2 border-0 font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              copied
                ? "bg-status-done text-white"
                : "bg-card text-foreground hover:bg-accent"
            }`}
          >
            {copied ? (
              <>
                <Check className="size-3" /> Copiado
              </>
            ) : (
              <>
                <Copy className="size-3" /> Copiar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 py-4">
        <div className="bg-white p-3 border border-border">
          <QRCode
            value={fullUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <QrCode className="size-3" /> Escanea con tu teléfono
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Rol</span>
          <span className="text-foreground">
            {formatWorkspaceRole(invitation.role)}
          </span>
        </div>
        {invitation.email && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Para</span>
            <span className="text-foreground truncate ml-2">
              {invitation.email}
            </span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Expira</span>
          <span className="text-foreground">
            {new Date(invitation.expiresAt).toLocaleString("es", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      <Button onClick={onDone} className="w-full">
        Entendido
      </Button>
    </div>
  );
}
