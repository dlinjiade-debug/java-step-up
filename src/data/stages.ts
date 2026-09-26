import type { StageId } from "../types/question.ts";

export interface StudyStage {
  id: StageId;
  number: string;
  name: string;
  subtitle: string;
  total: number;
  chapters: string[];
}

export const STAGES: StudyStage[] = [
  { id: "beginner", number: "01", name: "入门", subtitle: "从语法到第一次读懂代码", total: 60, chapters: ["变量与类型", "运算符", "流程控制", "数组", "方法"] },
  { id: "foundation", number: "02", name: "基础", subtitle: "面向对象与异常处理", total: 80, chapters: ["类与对象", "继承与多态", "接口", "字符串", "异常"] },
  { id: "advanced", number: "03", name: "进阶", subtitle: "集合、泛型与函数式编程", total: 80, chapters: ["集合", "Map", "泛型", "Stream", "IO"] },
  { id: "internals", number: "04", name: "深入", subtitle: "并发、JVM 与运行机制", total: 50, chapters: ["并发基础", "锁与线程池", "JVM 内存", "类加载", "反射"] },
  { id: "comprehensive", number: "05", name: "综合", subtitle: "把知识用到真实代码里", total: 30, chapters: ["代码阅读", "程序排错", "算法思路", "综合应用"] },
];
