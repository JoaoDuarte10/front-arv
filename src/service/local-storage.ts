export class LocalStorageService {
  constructor(private readonly key: string) {}

  getUser() {
    const user = localStorage.getItem(this.key);
    if (!user) return null;
    try {
      const userJson = JSON.parse(user);
      return userJson;
    } catch (error) {
      return null;
    }
  }

  saveLogin(params: any) {
    localStorage.setItem(this.key, JSON.stringify(params));
  }

  clearUser() {
    localStorage.removeItem(this.key);
  }
}
