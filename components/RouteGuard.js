import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { searchHistoryAtom } from '../store';
import { getFavourites, getHistory } from '../lib/userData';


const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {
    //Middleware
    const router = useRouter();

    //usestate hook
    const [authorized, setAuthorized] = useState(false);

    //useAtom
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    //keep updated and call authcheck function
    useEffect(() => {
        updateAtoms()
        authCheck(router.pathname);
        router.events.on('routeChangeComplete', authCheck)
        return () => {
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    //authcheck function
    function authCheck(url) {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }

    //async await function, keep the page updated
    async function updateAtoms(){
        setFavouritesList(await getFavourites());
        setSearchHistory(await getHistory());
    }

    return (
      <>
        {authorized && props.children}
      </>
    )
}