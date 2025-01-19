"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FiRefreshCw } from "react-icons/fi";
import Head from "next/head";

interface Token {
  label: string;
  value: string;
  price: number;
  icon: string;
}

const Home = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [prices, setPrices] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const { data } = await axios.get("https://interview.switcheo.com/prices.json");

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
    if (!fromToken || !toToken || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
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
      const calculatedResult = (Number(amount) * rate).toFixed(4);
      setResult(calculatedResult);
      setLoading(false);
    }, 1500);
  };

  const customSingleValue = ({ data }: { data: Token }) => (
    <div className="flex items-center gap-2">
      <img src={data.icon} alt={data.label} className="w-5 h-5" />
      {data.label}
    </div>
  );

  return (
    <>
      <Head>
        <title>Currency Swap</title>
        <meta name="description" content="Swap currencies using real-time data." />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md md:max-w-lg lg:max-w-xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Currency Swap</h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Select
              options={tokens}
              value={fromToken}
              onChange={setFromToken}
              placeholder="From Currency"
              getOptionLabel={(e) => (
                <div className="flex items-center gap-2">
                  <img src={e.icon} alt={e.label} className="w-6 h-6" />
                  {e.label}
                </div>
              )}
              components={{ SingleValue: customSingleValue }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <Select
              options={tokens}
              value={toToken}
              onChange={setToToken}
              placeholder="To Currency"
              getOptionLabel={(e) => (
                <div className="flex items-center gap-2">
                  <img src={e.icon} alt={e.label} className="w-6 h-6" />
                  {e.label}
                </div>
              )}
              components={{ SingleValue: customSingleValue }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <input
              type="number"
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={handleSwap}
              disabled={loading || !fromToken || !toToken || !amount}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-md ${
                loading || !fromToken || !toToken || !amount
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : "Swap"}
            </button>
          </div>

          {result && (
            <div className="mt-8 text-center">
              <p className="text-xl font-semibold text-gray-800">
                Result: {result} {toToken?.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
