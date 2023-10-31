import { Users, User, Truck } from 'react-feather'

export const DataOverview = [
    {
        id: 'customer',
        name: 'Total Customer',
        total: '12',
        percentage: '+9',
        icon:( <User size={28}/> )
    },
    {
        id: 'employe',
        name: 'Total Employee',
        total: '2',
        percentage: '+10',
        icon:( <Users size={28} /> )
    },
    {
        id: 'supplier',
        name: 'Total Suplier',
        total: '10',
        percentage: '+10',
        icon:( <Truck size={28} /> )
    },
]