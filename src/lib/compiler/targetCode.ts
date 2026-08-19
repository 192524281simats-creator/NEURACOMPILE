import type { TACInstruction, TargetInstruction } from "@/types";

const REGISTERS = ["R0","R1","R2","R3","R4","R5","R6","R7"];
let regIdx = 0;
const allocReg = () => REGISTERS[regIdx++ % REGISTERS.length];

export function generateTargetCode(tac: TACInstruction[]): TargetInstruction[] {
  regIdx = 0;
  const output: TargetInstruction[] = [];
  const regMap = new Map<string, string>();

  const getReg = (val: string): string => {
    if (regMap.has(val)) return regMap.get(val)!;
    const r = allocReg();
    regMap.set(val, r);
    return r;
  };

  output.push({ instruction: "; NEURACOMPILE Educational Target Code Generator", comment: "Header", fromTAC: "" });
  output.push({ instruction: "; Generated from Three Address Code", comment: "Header", fromTAC: "" });
  output.push({ instruction: ".section .text", comment: "Code section", fromTAC: "" });
  output.push({ instruction: ".global main", comment: "Entry point", fromTAC: "" });
  output.push({ instruction: "main:", comment: "Main label", fromTAC: "" });
  output.push({ instruction: "  PUSH  BP", comment: "Save base pointer", fromTAC: "" });
  output.push({ instruction: "  MOV   BP, SP", comment: "Set up stack frame", fromTAC: "" });

  for (const instr of tac) {
    output.push({ instruction: `  ; --- TAC: ${instr.result} = ${instr.arg1 ?? ""} ${instr.op} ${instr.arg2 ?? ""}`.trim(), comment: "TAC instruction", fromTAC: `${instr.result} = ${instr.arg1 ?? ""} ${instr.op} ${instr.arg2 ?? ""}`.trim() });

    if (instr.op === "=" && !instr.arg2) {
      const r = getReg(instr.result);
      output.push({ instruction: `  MOV   ${r}, ${instr.arg1}`, comment: `Load ${instr.arg1} into register ${r}`, fromTAC: instr.result });
    } else if (instr.op === "+") {
      const r1 = getReg(instr.arg1!), r2 = getReg(instr.arg2!), rd = allocReg();
      regMap.set(instr.result, rd);
      output.push({ instruction: `  MOV   ${rd}, ${r1}`, comment: `Load ${instr.arg1}`, fromTAC: instr.result });
      output.push({ instruction: `  ADD   ${rd}, ${r2}`, comment: `Add ${instr.arg2}`, fromTAC: instr.result });
    } else if (instr.op === "-") {
      const r1 = getReg(instr.arg1!), r2 = getReg(instr.arg2!), rd = allocReg();
      regMap.set(instr.result, rd);
      output.push({ instruction: `  MOV   ${rd}, ${r1}`, comment: `Load ${instr.arg1}`, fromTAC: instr.result });
      output.push({ instruction: `  SUB   ${rd}, ${r2}`, comment: `Subtract ${instr.arg2}`, fromTAC: instr.result });
    } else if (instr.op === "*") {
      const r1 = getReg(instr.arg1!), r2 = getReg(instr.arg2!), rd = allocReg();
      regMap.set(instr.result, rd);
      output.push({ instruction: `  MOV   R0, ${r1}`, comment: `Prepare multiplicand`, fromTAC: instr.result });
      output.push({ instruction: `  MUL   R0, ${r2}`, comment: `Multiply`, fromTAC: instr.result });
      output.push({ instruction: `  MOV   ${rd}, R0`, comment: `Store product`, fromTAC: instr.result });
    } else if (instr.op === "/") {
      const r1 = getReg(instr.arg1!), r2 = getReg(instr.arg2!), rd = allocReg();
      regMap.set(instr.result, rd);
      output.push({ instruction: `  MOV   R0, ${r1}`, comment: `Prepare dividend`, fromTAC: instr.result });
      output.push({ instruction: `  DIV   R0, ${r2}`, comment: `Divide`, fromTAC: instr.result });
      output.push({ instruction: `  MOV   ${rd}, R0`, comment: `Store quotient`, fromTAC: instr.result });
    } else if (instr.op === "RETURN") {
      const r = instr.arg1 ? getReg(instr.arg1) : "R0";
      output.push({ instruction: `  MOV   R0, ${r}`, comment: `Return value in R0`, fromTAC: "return" });
      output.push({ instruction: `  POP   BP`, comment: "Restore base pointer", fromTAC: "" });
      output.push({ instruction: `  RET`, comment: "Return from function", fromTAC: "return" });
    } else if (instr.op === "PRINT") {
      output.push({ instruction: `  PUSH  ${instr.arg1}`, comment: "Push argument", fromTAC: "print" });
      output.push({ instruction: `  CALL  printf`, comment: "Call print function", fromTAC: "print" });
      output.push({ instruction: `  ADD   SP, 4`, comment: "Clean up stack", fromTAC: "" });
    }
  }

  output.push({ instruction: "  POP   BP", comment: "Restore base pointer", fromTAC: "" });
  output.push({ instruction: "  MOV   R0, 0", comment: "Exit code 0", fromTAC: "" });
  output.push({ instruction: "  RET", comment: "Program end", fromTAC: "" });

  return output;
}
