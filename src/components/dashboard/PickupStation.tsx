import { useGetPickupDashboardStat } from "@/hooks/pickStationHook"
import { getUserIdHelper } from "@/lib/authHelper"

export const PickUpStationDash = ()=>{
    const userId = getUserIdHelper() ?? ''
    const {data} = useGetPickupDashboardStat(userId)
    if(data){

        return(
            <>

        </>
    )
}
}