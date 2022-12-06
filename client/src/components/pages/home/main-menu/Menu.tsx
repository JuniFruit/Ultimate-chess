import MenuButton from "../../../ui/menu-button/MenuButton";
import { IMenuBox, IMenuData } from "./Menu.interface";
import styles from './Menu.module.scss';


export function MenuBox <T extends IMenuData> ({ items, onHover, onClick }:IMenuBox<T>) {   

    return (
        <nav>
            <div className={styles.menu_box}>
                {items.map(item => {                    
                    return <MenuButton 
                        onClick={() => onClick(item)}
                        onMouseOver={() => onHover(item.preview)}
                        onFocus={() => onHover(item.preview)}
                        key={item.link}
                    >
                        {item.title}
                    </MenuButton>
                    
                
                })}
            </div>
        </nav>
    )
}

