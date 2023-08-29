export class LocalStorageService {
  constructor(private readonly key: string) {}

  public getUser() {
    const user = localStorage.getItem(this.key);
    if (!user) return null;
    try {
      const userJson = JSON.parse(user);
      return userJson;
    } catch (error) {
      return null;
    }
  }

  public getRules(): string[] | null {
    const user = localStorage.getItem(this.key);
    if (!user) return null;
    try {
      return JSON.parse(user).rules;
    } catch (error) {
      return null;
    }
  }

  public getAccessToken(): string | null {
    const user = localStorage.getItem(this.key);
    if (!user) return null;
    try {
      return JSON.parse(user).access_token;
    } catch (error) {
      return null;
    }
  }

  public saveLogin(params: any) {
    localStorage.setItem(this.key, JSON.stringify(params));
  }

  public clearUser() {
    localStorage.removeItem(this.key);
  }
}
