import { project } from "./project";
import { todo } from "./todo";

const item = todo("title", "description", "date", "priority");
console.log(item.title + item.content + item.due + item.priority);