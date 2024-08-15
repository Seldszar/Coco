declare module "*.gql" {
  import { QueryInput } from "./common/types";

  const content: QueryInput;
  export default content;
}
