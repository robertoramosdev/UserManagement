import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-slate-200 bg-white text-slate-800",
};

const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed right-4 top-4 z-50 flex w-full max-w-xs flex-col gap-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        role="status"
        onClick={() => onDismiss(t.id)}
        className={`cursor-pointer rounded-lg border px-4 py-3 text-sm shadow-sm transition ${styles[t.type]}`}
      >
        {t.message}
      </div>
    ))}
  </div>
);

export const useToast = () => useContext(ToastContext);
