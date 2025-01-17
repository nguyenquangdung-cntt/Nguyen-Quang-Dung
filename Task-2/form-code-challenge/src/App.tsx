import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FiRefreshCw } from "react-icons/fi";

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const { data } = await axios.get("https://interview.switcheo.com/prices.json");

        console.log("Dữ liệu API nhận được:", data);

        if (Array.isArray(data)) {
          setPrices(data);
          const tokenList = data.map((token) => ({
            label: token.currency,
            value: token.currency,
            price: token.price,
            icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`,
          }));

          setTokens(tokenList);
        } else {
          setError("Dữ liệu API không hợp lệ.");
        }
      } catch (error) {
        setError("Không thể tải dữ liệu từ API.");
        console.error("Error fetching token prices:", error);
      }
    };

    fetchTokenData();
  }, []);

  const handleSwap = () => {
    if (!fromToken || !toToken || !amount || isNaN(amount) || amount <= 0) {
      setError("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const fromPrice = prices.find((token) => token.currency === fromToken.value)?.price;
      const toPrice = prices.find((token) => token.currency === toToken.value)?.price;

      if (fromPrice === undefined || toPrice === undefined) {
        setError(`Không tìm thấy giá trị cho token: ${fromToken.value} hoặc ${toToken.value}.`);
        setLoading(false);
        return;
      }

      const rate = toPrice / fromPrice;
      const calculatedResult = (amount * rate).toFixed(4);
      setResult(calculatedResult);
      setLoading(false);
    }, 1500);
  };

  const customSingleValue = ({ data }) => (
    <div className="flex items-center gap-2">
      <img src={data.icon} alt={data.label} className="w-5 h-5" />
      {data.label}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Currency Swap</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Select
            options={tokens}
            value={fromToken}
            onChange={setFromToken}
            placeholder="From Currency"
            getOptionLabel={(e) => (
              <div className="flex items-center gap-2">
                <img src={e.icon} alt={e.label} className="w-5 h-5" />
                {e.label}
              </div>
            )}
            components={{ SingleValue: customSingleValue }}
          />
          <Select
            options={tokens}
            value={toToken}
            onChange={setToToken}
            placeholder="To Currency"
            getOptionLabel={(e) => (
              <div className="flex items-center gap-2">
                <img src={e.icon} alt={e.label} className="w-5 h-5" />
                {e.label}
              </div>
            )}
            components={{ SingleValue: customSingleValue }}
          />
          <input
            type="number"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleSwap}
            disabled={loading || !fromToken || !toToken || !amount}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md ${
              loading || !fromToken || !toToken || !amount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : "Swap"}
          </button>
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">
              Result: {result} {toToken.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
