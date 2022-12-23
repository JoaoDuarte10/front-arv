import jwt from "jsonwebtoken";

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
    return "";
  }
}
