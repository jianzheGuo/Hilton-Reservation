import { Alert, Box } from '@suid/material';
import { createSignal, Show } from 'solid-js';

export function useAlert() {
  const [open, setOpen] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [severity, setSeverity] = createSignal('info');

  const showAlert = (type, msg) => {
    setSeverity(type);
    setMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 6000);
  };

  const AlertComponent = () => (
    <Show when={open()}>
      <Box sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <Alert severity={severity()}>{message()}</Alert>
      </Box>
    </Show>
  );

  return { showAlert, AlertComponent };
}