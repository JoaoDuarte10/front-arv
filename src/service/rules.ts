import { useSelector } from "react-redux";
import { ReduceStore } from "../app/store";

export class RulesService {
  private rules: string[] = useSelector(
    (state: ReduceStore) => state.authenticated
  ).rules;

  userHasPermission(rule: string) {
    return this.rules.includes(rule);
  }
}
