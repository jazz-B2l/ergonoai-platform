-- Update the admin settings to store a hashed password instead of plain text
UPDATE public.admin_settings
SET value = 'b9ebebc15ab5f2c88d0530b4d0e3f078:571430716b389933ba757bbae070737742b0c370f398a201255697ebd4f85caf3fb894f320725adf140763b2ce377f01e4e1957a9c2dadbaf498c84f1d8c2e63'
WHERE key = 'admin_password';
