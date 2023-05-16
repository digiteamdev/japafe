import { Users, User, Truck } from 'react-feather'

export const DataOverview = [
    {
        name: 'Total Customer',
        total: '12',
        percentage: '+9',
        icon:( <User size={28}/> )
    },
    {
        name: 'Total Employee',
        total: '2',
        percentage: '+10',
        icon:( <Users size={28} /> )
    },
    {
        name: 'Total Supplier',
        total: '10',
        percentage: '+10',
        icon:( <Truck size={28} /> )
    },
]