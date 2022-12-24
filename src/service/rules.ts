import { LocalStorageService } from "./local-storage";

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
        return "schedule";
      default:
        return "";
    }
  }
}
