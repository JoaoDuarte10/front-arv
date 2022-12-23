export class LocalStorageService {
  constructor(private readonly key: string) {}

  getUserInLocalStorange() {
    const user = localStorage.getItem(this.key);
    if (!user) return null;
    try {
      const userJson = JSON.parse(user);
      return userJson;
    } catch (error) {
      return null;
    }
  }

  saveLoginInLocalStorage(params: any) {
    localStorage.setItem(this.key, JSON.stringify(params));
  }

  cleanUserInLocalStorange() {
    localStorage.removeItem(this.key);
  }
}
