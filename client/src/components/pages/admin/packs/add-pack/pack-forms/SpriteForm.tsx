import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { packApi } from "../../../../../../store/api/pack.api";
import { onlyNumbers, validURL } from "../../../../../../utils/validations.utils";
import { Button } from "../../../../../ui/button/Button";
import Field from "../../../../../ui/field/Field";
import { ISpriteForm, ISpriteFormComponent } from "./Forms.interface";
import styles from './Forms.module.scss';

const REQUIRED_MSG = 'Please provide a link to a sprite to continue';
const VALID_MSG = 'Please provide a valid URL';

const SpriteForm: FC<ISpriteFormComponent> = ({ form: { handleSubmit, register, errors }, defaultValues }) => {






    return (
        <form
            className={styles.form_wrapper}
            onSubmit={(e) => { e.preventDefault(); handleSubmit(e) }}>
            <Field
                {...register('blackBishop', {
                    required: REQUIRED_MSG,
                    pattern: {
                        value: validURL,
                        message: VALID_MSG
                    }
                })}
                placeholder={'Black Bishop'}
                title={'Black Bishop'}
                error={errors.blackBishop}
                defaultValue={defaultValues?.blackBishop}
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
                title={'Black Pawn'}
                error={errors.blackPawn}
                defaultValue={defaultValues?.blackPawn}

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
                title={'Black King'}

                error={errors.blackKing}
                defaultValue={defaultValues?.blackKing}

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
                title={'Black Rook'}

                error={errors.blackRook}
                defaultValue={defaultValues?.blackRook}

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
                title={'Black Queen'}

                error={errors.blackQueen}
                defaultValue={defaultValues?.blackQueen}

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
                title={'Black Knight'}

                error={errors.blackKnight}
                defaultValue={defaultValues?.blackKnight}

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
                title={'White Bishop'}

                error={errors.whiteBishop}
                defaultValue={defaultValues?.whiteBishop}

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
                title={'White King'}

                error={errors.whiteKing}
                defaultValue={defaultValues?.whiteKing}

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
                title={'White Knight'}

                error={errors.whiteKnight}
                defaultValue={defaultValues?.whiteKnight}

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
                title={'White Pawn'}

                error={errors.whitePawn}
                defaultValue={defaultValues?.whitePawn}

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
                title={'White Queen'}

                error={errors.whiteQueen}
                defaultValue={defaultValues?.whiteQueen}

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
                title={'White Rook'}

                error={errors.whiteRook}
                defaultValue={defaultValues?.whiteRook}

            />
            <Field
                {...register('frames', {
                    required: 'Please provide number of frames',
                    pattern: {
                        value: onlyNumbers,
                        message: 'Only number is allowed'
                    }
                })}
                placeholder={'Number of frames each sprite has'}
                title={'Frames'}

                error={errors.frames}
                defaultValue={defaultValues?.frames}

            />

            <div className={styles.buttons}>
                <Button>
                    Save Sprites
                </Button>
            </div>

        </form>
    )
}

export default SpriteForm