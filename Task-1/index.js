var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    const n = parseInt(document.getElementById("number").value);
    const resultA = sum_to_n_a(n);
    const resultB = sum_to_n_b(n);
    const resultC = sum_to_n_c(n);
    document.getElementById("result").innerHTML = `
        <p><strong>Input n:</strong> ${n}</p>
        <p><strong>Using Loop:</strong> ${resultA}</p>
        <p><strong>Using Formula:</strong> ${resultB}</p>
        <p><strong>Using Recursion:</strong> ${resultC}</p>
    `;
});
