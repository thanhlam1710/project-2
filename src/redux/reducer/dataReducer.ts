import {ActionProps} from '../action/bookingAction';
const initialValues = {
    data: []
};

export const DataReducer = (state:any = initialValues, action:ActionProps) => {

    switch(action.type) {

        case 'LOAD_DU_LIEU': {

            const data = action.payload.docs.map((item:any)=>({...item.data(), id: item.id}));

            state.data = data;

            return {...state};
        }
        break;
        
        default: return state;
    }
}  