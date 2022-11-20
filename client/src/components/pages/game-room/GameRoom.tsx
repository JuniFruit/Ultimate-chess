import { FC } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { Field } from "./field/Field";
import { useGameRoom } from "./useGameRoom";



const GameRoom: FC = () => {    

    const {id} = useParams()
    const {field} = useGameRoom(id)
    
    return (
        <Layout title="Ultimate Chess Game Room">
            <Field board={field.board} setBoard={field.setBoard} />

        </Layout>
    )
}

export default GameRoom;