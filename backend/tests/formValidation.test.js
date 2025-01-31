const { validateEmail, validatePassword } = require('../validations/formValidation');

test('validar email correcto', () => {
	expect(validateEmail('test@example.com')).toBe(true);
});

test('validar email incorrecto', () => {
	expect(validateEmail('test@.com')).toBe(false);
	expect(validateEmail('test.com')).toBe(false);
});

test('validar contraseña válida', () => {
	expect(validatePassword('Password123!')).toBe(true);
});

test('validar contraseña inválida', () => {
	expect(validatePassword('short')).toBe(false);
	expect(validatePassword('noSpecialChar123')).toBe(false);
});