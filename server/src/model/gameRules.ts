import { Colors } from '../../../client/src/model/colors.enum';



export const GameRules = {

    assignColors(): Colors[] {
        const colors = [Colors.BLACK, Colors.WHITE].sort(() => 0.5 - Math.random());
        return colors;
    }
}