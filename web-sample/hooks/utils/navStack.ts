const STACK_KEY = "avom_nav_stack";
const BACK_FLAG = "avom_nav_going_back";

/** Read the current stack from sessionStorage */
export const getStack = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(STACK_KEY) ?? "[]");
  } catch {
    return [];
  }
};

/** Push a path onto the stack (no-op if already on top) */
export const pushToStack = (path: string) => {
  const stack = getStack();
  if (stack[stack.length - 1] === path) return;
  stack.push(path);
  sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
};

/** Remove and return the top entry */
export const popFromStack = (): string | undefined => {
  const stack = getStack();
  const top = stack.pop();
  sessionStorage.setItem(STACK_KEY, JSON.stringify(stack));
  return top;
};

/** Signal that the next pathname change comes from router.back(), not a forward nav */
export const setGoingBack = () => sessionStorage.setItem(BACK_FLAG, "true");
export const clearGoingBack = () => sessionStorage.removeItem(BACK_FLAG);
export const isGoingBack = () => sessionStorage.getItem(BACK_FLAG) === "true";
