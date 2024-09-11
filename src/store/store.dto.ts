// store.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  store_name: string;

  @IsOptional()
  @IsString()
  store_description?: string;

  @IsNotEmpty()
  @IsString()
  store_address: string;

  @IsOptional()
  @IsString()
  store_contact?: string;

  @IsOptional()
  @IsString()
  store_logo?: string; // This could be a URL or file path if handled separately
}
