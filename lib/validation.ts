// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre minuscule';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Le mot de passe doit contenir au moins une lettre majuscule';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  return null;
};

export const validateStudentData = (data: {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}): string[] => {
  const errors: string[] = [];

  if (!data.nom.trim()) errors.push('Le nom est requis');
  if (!data.prenom.trim()) errors.push('Le prénom est requis');
  if (!validateEmail(data.email)) errors.push('Format d\'email invalide');
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  return errors;
};
