import {useEffect, useState} from 'react'
import {
    Autocomplete,
    Box,
    Button,
    Container,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import axios from "axios";
import {currencyMapping} from "./constants/currencyMapping.js";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import colors from './constants/Colors/Colours.js'
import {Bounce, toast, ToastContainer} from "react-toastify";

function App() {
    const [currencyList, setCurrencyList] = useState([]);
    const [data, setData] = useState({amount: 1, source: 'EUR', target: 'USD'});
    const [convertAmount, setConvertAmount] = useState('');
    const [advOpt, setAdvOpt] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAutocompleteChange = (name, newValue) => {
        if (newValue) {
            setData((prevState) => ({
                ...prevState,
                [name]: newValue.code
            }));
        }
    };

    useEffect(() => {
        async function getCurrencyList() {
            try {
                const response = await axios.get("http://localhost:3000/api/currency");
                const currencyArray = Object.values(response.data.data);
                setCurrencyList(currencyArray);
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }

        getCurrencyList();
    }, []);

    async function convertCurrency() {
        try {
            const response = await axios.post("http://localhost:3000/api/currency/convert", data);
            setConvertAmount(response.data.data);
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    function handleSwap() {
        setData((prevState) => ({
            ...prevState,
            source: prevState.target,
            target: prevState.source,
        }));
        setConvertAmount('');
    }

    return (
        <Box sx={{
            backgroundColor: colors.MainColor,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            <ToastContainer />
            <Container sx={{backgroundColor: colors.White, borderRadius: 7, py: 5, mx: {xs: 1, md: 'auto'}}}>
                <FormGroup sx={{justifyContent: 'right'}}>
                    <FormControlLabel control={<Switch/>} label="Advanced Options" labelPlacement="start"
                                      onChange={(e) => setAdvOpt(e.target.checked)}/>
                </FormGroup>
                <Stack direction={{xs: 'column', md: 'row'}} alignItems="center" justifyContent='space-between'
                       sx={{mt: 2, mb: 4}}>
                    <Stack direction="row" justifyContent='space-between'
                           sx={{border: '1px solid black', borderRadius: 3, pt: 1.5, width: "fit-content"}}>
                        <TextField
                            variant="outlined"
                            name='amount'
                            label='Amount'
                            required
                            value={data?.amount || ''}
                            onChange={handleChange}
                            sx={{
                                border: 'none',
                                "& fieldset": {border: 'none'},
                                '.MuiInputBase-input': {
                                    fontSize: {xs: 15, md: 20},
                                    fontWeight: 'bold',
                                    color: colors.Black1
                                },
                                '.MuiFormLabel-root': {fontSize: {xs: 15, md: 20}, color: colors.Black1},
                                width: '35%'
                            }}
                        />
                        <Autocomplete
                            sx={{
                                width: 150, "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none",
                                    },
                                    "&:hover fieldset": {
                                        border: "none",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "none",
                                    },
                                },
                            }}
                            options={currencyList}
                            onChange={(event, newValue) => handleAutocompleteChange('source', newValue)}
                            autoHighlight
                            getOptionLabel={(option) => option.code}
                            value={currencyList.find(option => option.code === data.source) || null}
                            renderOption={(props, option) => {
                                const {key, ...optionProps} = props;
                                const countryCode = currencyMapping[option.code];
                                return (
                                    <Box
                                        key={key}
                                        component="li"
                                        sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                        {...optionProps}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
                                            src={`https://flagcdn.com/w20/${countryCode}.png`}
                                            alt=""
                                        />
                                        {option.code}
                                    </Box>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: data.source ? (
                                            <img
                                                loading="lazy"
                                                width="20"
                                                srcSet={`https://flagcdn.com/w40/${currencyMapping[data.source]}.png 2x`}
                                                src={`https://flagcdn.com/w20/${currencyMapping[data.source]}.png`}
                                                alt=""
                                                style={{marginRight: 8}}
                                            />
                                        ) : null,
                                    }}
                                />
                            )}
                        />
                    </Stack>

                    <SwapHorizIcon
                        fontSize='large'
                        sx={{my: {xs: 2, md: 0}, "&:hover": {
                            color: colors.MainColor,
                            cursor:'pointer'
                        }}}
                        onClick={handleSwap}
                    />

                    <Stack direction="row" justifyContent='space-between'
                           sx={{border: '1px solid black', borderRadius: 3, pt: 1.5, width: "fit-content"}}>
                        <TextField
                            variant="outlined"
                            label="Converted To"
                            value={convertAmount}
                            sx={{
                                border: 'none', "& fieldset": {border: 'none'},
                                '.MuiInputBase-input': {
                                    fontSize: {xs: 15, md: 25},
                                    fontWeight: 'bold',
                                    color: colors.Black1
                                },
                                '.MuiFormLabel-root': {fontSize: {xs: 15, md: 20}, color: colors.Black1},
                                width: '35%'
                            }}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}/>
                        <Autocomplete
                            sx={{
                                width: 150,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none",
                                    },
                                    "&:hover fieldset": {
                                        border: "none",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "none",
                                    },
                                },
                            }}
                            options={currencyList}
                            onChange={(event, newValue) => handleAutocompleteChange('target', newValue)}
                            autoHighlight
                            getOptionLabel={(option) => option.code}
                            value={currencyList.find(option => option.code === data.target) || null}
                            renderOption={(props, option) => {
                                const {key, ...optionProps} = props;
                                const countryCode = currencyMapping[option.code];
                                return (
                                    <Box
                                        key={key}
                                        component="li"
                                        sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                        {...optionProps}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
                                            src={`https://flagcdn.com/w20/${countryCode}.png`}
                                            alt=""
                                        />
                                        {option.code}
                                    </Box>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: data.target ? (
                                            <img
                                                loading="lazy"
                                                width="20"
                                                srcSet={`https://flagcdn.com/w40/${currencyMapping[data.target]}.png 2x`}
                                                src={`https://flagcdn.com/w20/${currencyMapping[data.target]}.png`}
                                                alt=""
                                                style={{marginRight: 8}}
                                            />
                                        ) : null,
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Stack>
                <Stack direction='row' alignItems="center" spacing={2} sx={{width: '100%'}}>
                    {advOpt && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Date" defaultValue={dayjs('2022-04-17')}/>
                        </LocalizationProvider>
                    )}
                    <Box sx={{flexGrow: 1}}/>
                    <Button variant="contained"
                            sx={{backgroundColor: colors.GradientDark, borderRadius: 2, px: 5, py: 2}}
                            onClick={convertCurrency}>
                        Convert
                    </Button>
                </Stack>
            </Container>
        </Box>
    )
}

export default App
