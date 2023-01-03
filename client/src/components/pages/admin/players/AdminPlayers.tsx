import { FC, useState, useEffect } from "react";
import { useSearch } from "../../../../hooks/useSearch";
import { api } from "../../../../store/api/api";
import { IUser } from "../../../../types/user.interface";
import { PlayerItem } from "../../../ui/admin/items/PlayerItem";
import { AdminPanel } from "../../../ui/admin/main/AdminPanel";
import { useAdminAuth } from "../../../../hooks/useAdminAuth";
import { AddRole } from "./actions/AddRole";
import { DeleteRole } from "./actions/DeleteRole";
import styles from './AdminPlayer.module.scss';
import Search from "./search-bar/Search";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../../hooks/useMobile";

const AdminPlayers: FC = () => {
    useAdminAuth();

    const [dataToRender, setDataToRender] = useState<IUser[]>([]);
    const {isMobile} = useIsMobile();
    const navigate = useNavigate()
    const { data: users } = api.useGetAllQuery(null);
    const { handleSearch, data: searchResults, searchTerm } = useSearch()

    const handleClick = (id:number) => {
        navigate(`/user/${id}`)
    }

    useEffect(() => {
        if (isMobile) return navigate('/');
        if (searchResults?.length) return setDataToRender(searchResults);
        if (users?.length) return setDataToRender(users);

    }, [searchResults, users])

    return (
        <AdminPanel title="Players">
            <div className={styles.search_bar}>
                <Search
                    handleSearch={handleSearch}
                    searchTerm={searchTerm}
                />
            </div>
            <div className={styles.users}>
                {
                    dataToRender?.length
                        ?
                        dataToRender.map(user => (
                            <PlayerItem
                                user={{ ...user }}
                                onClick={() => handleClick(user.id)}
                                key={user.id}>
                                    <AddRole userId={user.id} />
                                    <DeleteRole userId={user.id} roles={user.roles} />
                            </PlayerItem>

                        ))
                        : null
                }
            </div>

        </AdminPanel>
    )
}

export default AdminPlayers;