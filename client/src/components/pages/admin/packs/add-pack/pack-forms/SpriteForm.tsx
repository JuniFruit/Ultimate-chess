import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { packApi } from "../../../../../../store/api/pack.api";
import { validURL } from "../../../../../../utils/validations.utils";
import { Button } from "../../../../../ui/button/Button";
import Field from "../../../../../ui/field/Field";
import { ISpriteForm } from "./Forms.interface";
import styles from './Forms.module.scss';

const REQUIRED_MSG = 'Please provide a link to a sprite to continue';
const VALID_MSG = 'Please provide a valid URL';

const SpriteForm: FC<{ onSuccess: (id: number) => void; }> = ({ onSuccess }) => {

    const [createSpritePack] = packApi.useCreateSpritePackMutation()
    const { register, formState: { errors }, handleSubmit } = useForm<ISpriteForm>({
        mode: "onChange"
    })


    const onSubmit: SubmitHandler<ISpriteForm> = (data) => {
        createSpritePack(data).unwrap().then(res => onSuccess(res.id));
    }

    return (
        <form
            className={styles.form_wrapper}
            onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }}>
            <Field
                {...register('blackBishop', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Bishop'}
                error={errors.blackBishop}
            />
            <Field
                {...register('blackPawn', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Pawn'}
                error={errors.blackPawn}
            />
            <Field
                {...register('blackKing', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black King'}
                error={errors.blackKing}
            />
            <Field
                {...register('blackRook', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Rook'}
                error={errors.blackRook}
            />
            <Field
                {...register('blackQueen', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Queen'}
                error={errors.blackQueen}
            />
            <Field
                {...register('blackKnight', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Knight'}
                error={errors.blackKnight}
            />
            <Field
                {...register('whiteBishop', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White Bishop'}
                error={errors.whiteBishop}
            />
            <Field
                {...register('whiteKing', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White King'}
                error={errors.whiteKing}
            />
            <Field
                {...register('whiteKnight', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White Knight'}
                error={errors.whiteKnight}
            />
            <Field
                {...register('whitePawn', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White Pawn'}
                error={errors.whitePawn}
            />
            <Field
                {...register('whiteQueen', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White Queen'}
                error={errors.whiteQueen}
            />
            <Field
                {...register('whiteRook', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'White Rook'}
                error={errors.whiteRook}
            />

            <div className={styles.buttons}>
                <Button>
                    Create Sprites
                </Button>
            </div>

        </form>
    )
} 

export default SpriteForm