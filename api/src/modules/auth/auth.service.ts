import type { DataSource, Repository } from "typeorm";
import { User } from "../../entities/user.entity.ts";
import { Session } from "../../entities/session.entity.ts";
import { AppError } from "../../errors/app-error.ts";
import type {
    AuthResponseDto,
    LoginInputDto,
    RegisterInputDto,
} from "./dto/auth.dto.ts";
import { toUserResponseDto } from "./dto/auth.dto.ts";
import { SESSION_TTL_MS } from "./auth.constants.ts";


export class AuthService {
    private readonly userRepo: Repository<User>;
    private readonly sessionRepo: Repository<Session>;

    constructor(private readonly dataSource: DataSource) {
        this.userRepo = dataSource.getRepository(User);
        this.sessionRepo = dataSource.getRepository(Session);
    }

    async register(input: RegisterInputDto): Promise<AuthResponseDto & { sessionToken: string }> {
        const exists = await this.userRepo.findOne({ where: { email: input.email } });
        if (exists) throw AppError.conflict("Email already exists");

        const passwordHash = await Bun.password.hash(input.password);
        const user = this.userRepo.create({
            email: input.email,
            passwordHash,
            name: input.name,
        });
        await this.userRepo.save(user);

        const sessionToken = await this.createSession(user);
        return { user: toUserResponseDto(user), sessionToken };
    }

    async login(input: LoginInputDto): Promise<AuthResponseDto & { sessionToken: string }> {
        const user = await this.userRepo.findOne({ where: { email: input.email } });
        if (!user) throw AppError.unauthorized("Invalid credentials");
        
        const ok = await Bun.password.verify(input.password, user.passwordHash);
        if (!ok) throw AppError.unauthorized("Invalid credentials");

        const sessionToken = await this.createSession(user);
        return { user: toUserResponseDto(user), sessionToken };
    }

    async validateSession(token: string): Promise<User | null> {
        const session = await this.sessionRepo.findOne({
            where: { tokenHash: sha256(token) },
            relations: { user: true },
        });
        if (!session || session.expiresAt < new Date()) return null;
        return session.user;
    }

    async logout(token: string): Promise<void> {
        await this.sessionRepo.delete({ tokenHash: sha256(token) });
    }

    private async createSession(user: User): Promise<string> {
        const token = Bun.randomUUIDv7();
        const session = this.sessionRepo.create({
            user,
            tokenHash: sha256(token),
            expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        });
        await this.sessionRepo.save(session);
        return token;
    }
}

function sha256(value: string): string {
    const h = new Bun.CryptoHasher("sha256");
    h.update(value);
    return h.digest("hex");
}