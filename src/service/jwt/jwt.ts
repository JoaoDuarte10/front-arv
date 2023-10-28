import jwt from 'jsonwebtoken';

export type Rules = {
  idrules: number;
  ruleName: string;
};
export class JwtService {
  constructor(private readonly secrectToken: string) {}
  isValid(token: string): boolean {
    try {
      jwt.verify(token, this.secrectToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  getUserName(token: string): string {
    const user: any = jwt.decode(token);
    if (user) {
      return user.username;
    }
    return '';
  }

  getRules(token: string): string[] {
    const jwtDecoded = jwt.decode(token) as any;
    return jwtDecoded.rules.map((rule: Rules) => rule.ruleName);
  }
}
