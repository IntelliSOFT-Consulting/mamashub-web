import axios from 'axios';
import { config } from 'dotenv';
import { format } from 'date-fns';

config();

const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return format(new Date(tomorrow), 'yyyy-MM-dd');
};

const getPushList = async () => {
    const url = `${process.env.FHIR_BASE_URL
        }/Observation?code=390840006&value-string=${getTomorrow()}&_format=json`;
    const { data } = await axios.get(url);
    return data;
};

export default getPushList;
