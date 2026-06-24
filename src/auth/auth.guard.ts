import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

// extend express Request with a typed user property
interface AuthenticatedRequest extends Request {
  user?: Record<string, unknown>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 💡 Here the JWT secret key that's used for verifying the payload
      // is the key that was passed in the JwtModule

      const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // assign verified payload to typed request.user
      request.user = payload;
    } catch (_err: unknown) {
      // catch typed as unknown to avoid unsafe assignment of an error value
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
