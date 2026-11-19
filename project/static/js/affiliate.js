// Affiliate 14% Commission Share Modal & Referral Link Copy
function openShareModal(productName, productSlug, price, affiliateId) {
  const modal = document.getElementById("shareModal");
  if (!modal) return;

  const commission = Math.round((Number(price) * 14) / 100);
  const relativePath = `/product/${productSlug}?ref=${affiliateId}`;
  const fullUrl = `${window.location.origin}${relativePath}`;

  document.getElementById("shareProductName").textContent = productName;
  document.getElementById("shareProductPrice").textContent = `Rs. ${Number(price).toLocaleString()}`;
  document.getElementById("shareCommissionAmt").textContent = `Rs. ${commission.toLocaleString()}`;
  document.getElementById("shareReferralInput").value = fullUrl;

  const shareText = `Check out ${productName} for Rs. ${Number(price).toLocaleString()} on BazaarLink: ${fullUrl}`;
  document.getElementById("shareWhatsappLink").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  document.getElementById("shareFacebookLink").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

  modal.classList.add("open");
}

function closeShareModal() {
  const modal = document.getElementById("shareModal");
  if (modal) modal.classList.remove("open");
}

function copyAffiliateLink() {
  const input = document.getElementById("shareReferralInput");
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    if (typeof showToast === "function") {
      showToast("Referral link copied to clipboard");
    }
  });
}
