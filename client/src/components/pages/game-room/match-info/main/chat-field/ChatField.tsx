import { FC, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoSend } from 'react-icons/io5';
import { IMessage } from '../../../../../../constants/socketIO/ClientEvents.interface';
import { Button } from '../../../../../ui/button/Button';
import { MessageItem } from '../../../../../ui/chat/MessageItem';
import Field from '../../../../../ui/field/Field';

import styles from './Chat.module.scss';
import { IChatField } from './ChatField.interface';


export const ChatField: FC<IChatField> = ({ onSend, messages }) => {


    const { register, formState: { errors }, handleSubmit, setValue } = useForm<IMessage>()
    const onSubmit: SubmitHandler<IMessage> = (data) => {
        onSend(data);
        setValue('body', '');
    }
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!messagesRef.current) return;
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages])

    return (
        <div className={styles.chat_box_wrapper}>
            <div
                className={styles.messages_wrapper}
                ref={messagesRef}

            >
                {
                    messages.length
                        ?
                        messages.map(msg => (
                            <MessageItem {...{ ...msg }} key={msg.timestamp} />
                        ))
                        : null
                }
            </div>
            <form
                onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }}
                className={styles.chat_form}
            >
                <Field
                    {...register("body", {
                        required: 'Please enter your message'
                    })}
                    error={errors.body}
                    placeholder={'Send a message'}
                />
                <Button aria-label={'send a message'}>
                    <IoSend />
                </Button>
            </form>
        </div>
    )
}


