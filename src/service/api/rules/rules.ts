import { LocalStorageService } from "../../localStorage/local-storage";

export class RulesService {
  private rules: string[] = [];

  constructor(private readonly localStorageService: LocalStorageService) {
    const userRules = localStorageService.getRules();
    if (userRules) this.rules = userRules;
  }

  userHasPermission(rule: string) {
    return this.rules.includes(rule);
  }

  ruleWithPage(page: string): string {
    switch (page) {
      case "schedule":
      case "schedules":
        return "schedule";
      case "clients":
        return "clients";
      case "sales":
        return "sales";
      case "outgoing":
        return "outgoing";
      case "catalogs":
        return "catalogs";
      default:
        return "";
    }
  }
}
