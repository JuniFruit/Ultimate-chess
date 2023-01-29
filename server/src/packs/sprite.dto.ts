import { IsNumber, Matches } from "class-validator";
import { validURL } from "../utils/utils";

export class SpriteDto {

    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackBishop!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whiteBishop!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackKing!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whiteKing!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackPawn!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whitePawn!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackQueen!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whiteQueen!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackRook!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whiteRook!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    blackKnight!: string;
    @Matches(validURL, {
        message: "Please provide a valid URL"
    })
    whiteKnight!: string;

    @IsNumber()
    frames!: number;
}