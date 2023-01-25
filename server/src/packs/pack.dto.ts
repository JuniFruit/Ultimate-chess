import { IsNumber, IsString, Matches } from "class-validator";
import { notEmpty, validURL } from '../utils/utils';

export class PackDto {

    @IsNumber()
    packPath!: number;

    @IsString()
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    preview!: string;

    @IsString()
    @Matches(notEmpty, {
        message: "Cannot be empty"
    })
    title!: string;

    @IsString()
    @Matches(notEmpty, {
        message: "Cannot be empty"
    })
    sysName!: string;

}