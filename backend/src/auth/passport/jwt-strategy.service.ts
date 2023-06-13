import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { default as config} from '../../config'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.secretOrKey
        })
    }
    async validate(payload) {
        const user = await this.authService.validateUser(payload);
        if(!user) {
            return null
        }
        return user
    }
}
