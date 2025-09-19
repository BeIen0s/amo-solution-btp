import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  Matches,
  IsNotEmpty,
  Length
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ===== LOGIN DTO =====
export class LoginDto {
  @ApiProperty({
    example: 'admin@amo-solution-btp.com',
    description: 'Adresse email de l\'utilisateur',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'Mot de passe de l\'utilisateur',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Code de vérification à deux facteurs (si activé)',
  })
  @IsOptional()
  @IsString({ message: 'Le code 2FA doit être une chaîne' })
  @Length(6, 6, { message: 'Le code 2FA doit contenir exactement 6 chiffres' })
  @Matches(/^\d{6}$/, { message: 'Le code 2FA doit contenir uniquement des chiffres' })
  twoFactorCode?: string;
}

// ===== REGISTER DTO =====
export class RegisterDto {
  @ApiProperty({
    example: 'jean.dupont@entreprise.com',
    description: 'Adresse email de l\'utilisateur',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @ApiProperty({
    example: 'Jean',
    description: 'Prénom de l\'utilisateur',
  })
  @IsString({ message: 'Le prénom doit être une chaîne' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' })
  firstName: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'Nom de famille de l\'utilisateur',
  })
  @IsString({ message: 'Le nom doit être une chaîne' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  lastName: string;

  @ApiPropertyOptional({
    example: 'jean.dupont',
    description: 'Nom d\'utilisateur (optionnel)',
  })
  @IsOptional()
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne' })
  @MinLength(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' })
  @MaxLength(30, { message: 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères' })
  @Matches(/^[a-zA-Z0-9._-]+$/, { 
    message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores' 
  })
  username?: string;

  @ApiPropertyOptional({
    example: '+33123456789',
    description: 'Numéro de téléphone',
  })
  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Format de téléphone invalide' })
  phone?: string;

  @ApiProperty({
    example: 'MonMotDePasse123!',
    description: 'Mot de passe fort',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial' }
  )
  password: string;
}

// ===== TWO FACTOR DTO =====
export class TwoFactorDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token temporaire reçu lors de la première étape de connexion',
  })
  @IsString({ message: 'Le token temporaire doit être une chaîne' })
  @IsNotEmpty({ message: 'Le token temporaire est requis' })
  tempToken: string;

  @ApiProperty({
    example: '123456',
    description: 'Code de vérification à six chiffres',
  })
  @IsString({ message: 'Le code doit être une chaîne' })
  @IsNotEmpty({ message: 'Le code est requis' })
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 chiffres' })
  @Matches(/^\d{6}$/, { message: 'Le code doit contenir uniquement des chiffres' })
  code: string;
}

// ===== CHANGE PASSWORD DTO =====
export class ChangePasswordDto {
  @ApiProperty({
    example: 'AncienMotDePasse123!',
    description: 'Mot de passe actuel',
  })
  @IsString({ message: 'Le mot de passe actuel doit être une chaîne' })
  @IsNotEmpty({ message: 'Le mot de passe actuel est requis' })
  currentPassword: string;

  @ApiProperty({
    example: 'NouveauMotDePasse123!',
    description: 'Nouveau mot de passe fort',
  })
  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne' })
  @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(128, { message: 'Le nouveau mot de passe ne peut pas dépasser 128 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial' }
  )
  newPassword: string;
}

// ===== REFRESH TOKEN DTO =====
export class RefreshTokenDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Token de rafraîchissement',
  })
  @IsString({ message: 'Le token de rafraîchissement doit être une chaîne' })
  @IsNotEmpty({ message: 'Le token de rafraîchissement est requis' })
  refreshToken: string;
}

// ===== FORGOT PASSWORD DTO =====
export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email pour la réinitialisation du mot de passe',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;
}

// ===== RESET PASSWORD DTO =====
export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de réinitialisation reçu par email',
  })
  @IsString({ message: 'Le token de réinitialisation doit être une chaîne' })
  @IsNotEmpty({ message: 'Le token de réinitialisation est requis' })
  token: string;

  @ApiProperty({
    example: 'NouveauMotDePasse123!',
    description: 'Nouveau mot de passe fort',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial' }
  )
  password: string;
}

// ===== VERIFY 2FA CODE DTO =====
export class VerifyTwoFactorCodeDto {
  @ApiProperty({
    example: '123456',
    description: 'Code de vérification à six chiffres',
  })
  @IsString({ message: 'Le code doit être une chaîne' })
  @IsNotEmpty({ message: 'Le code est requis' })
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 chiffres' })
  @Matches(/^\d{6}$/, { message: 'Le code doit contenir uniquement des chiffres' })
  code: string;
}