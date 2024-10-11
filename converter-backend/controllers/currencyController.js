import {convertCurrency, currencyList} from "../services/currencyService.js";


export const getConvert = async (req, res) => {
    try {
        const result = await convertCurrency(req.body);
        res.status(200).json({success:true, data:result});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
};

export const getCurrencyList = async (req, res) => {
    try {
        const result = await currencyList();
        res.status(200).json({success:true, data:result});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
};


