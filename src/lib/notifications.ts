import { toast } from 'sonner';

export const showSuccess = (actionName: string) => {
  toast.success(`Action Successful`, {
    description: `Executed: ${actionName}`
  });
};

export const showError = (actionName: string, resource: string, error: any) => {
  const errCode = error?.code || 'UNKNOWN_ERROR';
  const errMsg = error?.message || String(error);
  
  let suggestedFix = 'Check inputs and try again.';
  if (errCode.includes('permission-denied')) {
    suggestedFix = 'Sign out, sign back in as an administrator, and check your security rules.';
  } else if (errCode.includes('not-found')) {
    suggestedFix = 'The requested resource could not be found. It may have been deleted.';
  } else if (errCode.includes('unauthenticated')) {
    suggestedFix = 'You must be logged in to perform this action.';
  }

  const debugInfo = `Failed Action: ${actionName}
Failed Resource: ${resource}
Error Code: ${errCode}
Error Message: ${errMsg}

Suggested Fix: ${suggestedFix}`;

  console.error(debugInfo);
  toast.error(`Action Failed: ${actionName}`, {
    description: errMsg,
    duration: 5000,
  });
};
