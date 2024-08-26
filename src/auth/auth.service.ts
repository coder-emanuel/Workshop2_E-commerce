import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { bcrypt } from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return { message: 'User registered successfully'};
    }

    async login(loginDto: LoginDto) {
        const payload = { email: loginDto.email, sub: 1, role: 'user'}; //  Ajusta el sub con el ID del usuario
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
