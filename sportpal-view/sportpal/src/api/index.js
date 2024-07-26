let __instance = null
let uri = 'http://localhost:3000'

export default class API {
    static instance() {
        if(__instance == null)
            __instance = new API()

        return __instance
    }


    async login (email, pass){
        try{
            const login = await fetch (uri + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email: email, password: pass }),
                credentials: 'include'
            })

            if (login.ok){
                const data = await login.json();
                localStorage.setItem('user', JSON.stringify(data));
                return true;
            } else {
                return false;
            }

        } catch (error){
            console.error('Error during login:', error);
            return false;
        }
    }

    async createUser (user){
        console.log("entra")
        try{
            const response = await fetch (uri + '/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })

            if (response.ok){
                const data = await response.json()
                localStorage.setItem('user', JSON.stringify(data));
                return data
            } else {
                throw new Error('Failed to create user');
            }

        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    async buscarUsuarios (usename){
        try {
            const response = await fetch(uri + '/users/buscar?username=' + usename, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get users');
            }
        } catch (error) {
            console.error('Error getting users:', error);
            return null;
        }
    }

    async buscarEquipos (teamname){
        try {
            const response = await fetch(uri + '/teams/buscar?name=' + teamname, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get teams');
            }
        } catch (error) {
            console.error('Error getting teams:', error);
            return null;
        }
    }

    async getEvents(filters){
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${uri}/events?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get events');
            }
        } catch (error) {
            console.error('Error getting events:', error);
            return null;
        }
    }

    async createEvent(event){
        try {
            const response = await fetch(uri + '/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(event),
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            return null;
        }
    }

    async getSports (){
        try {
            const response = await fetch(uri + '/sports', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get sports');
            }
        } catch (error) {
            console.error('Error getting sports:', error);
            return null;
        }
    }

    async getSportById (id){
        try {
            const response = await fetch(uri + '/sports/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get sport');
            }
        } catch (error) {
            console.error('Error getting sport:', error);
            return null;
        }
    }

    async getUsers (filters){
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${uri}/users?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get users');
            }
        } catch (error) {
            console.error('Error getting users:', error);
            return null;
        }
    }

    async getTeams (filters){
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${uri}/teams?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get teams');
            }
        } catch (error) {
            console.error('Error getting teams:', error);
            return null;
        }
    }

    async createTeam(team){
        try {
            const response = await fetch(uri + '/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(team),
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to create team');
            }
        } catch (error) {
            console.error('Error creating team:', error);
            return null;
        }
    }

    async enviarSolicitudAmistad (id){
        try {
            const response = await fetch(uri + '/users/friendRequest/' + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            return null;
        }
    }

    async acceptFriendRequest (id){
        try {
            const response = await fetch(uri + '/users/acceptFriendRequest/' + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            return null;
        }
    }

    async rejectFriendRequest (id){
        try {
            const response = await fetch(uri + '/users/deleteFriendRequest/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to reject friend request');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            return null;
        }
    }

    async deleteFriend (id){
        try {
            const response = await fetch(uri + '/users/removeFriend/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to delete friend');
            }
        } catch (error) {
            console.error('Error deleting friend:', error);
            return null;
        }
    }

    async unirseEventoIndividual (id){
        try {
            const response = await fetch(uri + '/events/join/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to join event');
            }
        } catch (error) {
            console.error('Error joining event:', error);
            return null;
        }
    }

    async unirseEventoEquipo (id, teamId){
        try {
            const response = await fetch(uri + '/events/join/' + id + 'team/' + teamId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to join event');
            }
        } catch (error) {
            console.error('Error joining event:', error);
            return null;
        }
    }


    async getChatFriend (id){
        try {
            const response = await fetch(uri + '/chats/friend/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get chat');
            }
        } catch (error) {
            console.error('Error getting chat:', error);
            return null;
        }
    }

    async getChatTeam (id){
        try {
            const response = await fetch(uri + '/chats/team/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get chat');
            }
        } catch (error) {
            console.error('Error getting chat:', error);
            return null;
        }
    }

    async getChatEvent (id){
        try {
            const response = await fetch(uri + '/chats/event/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get chat');
            }
        } catch (error) {
            console.error('Error getting chat:', error);
            return null;
        }
    }


    async solicitarUnirseEquipo (id){
        try {
            const response = await fetch(uri + '/teams/join/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to join team');
            }
        } catch (error) {
            console.error('Error joining team:', error);
            return null;
        }
    } 

    async getEventsAMostrar (filters){
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(uri + `/events/eventsMostrar?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok){
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to get events');
            }
        } catch (error) {
            console.error('Error getting events:', error);
            return null;
        }
    }

}