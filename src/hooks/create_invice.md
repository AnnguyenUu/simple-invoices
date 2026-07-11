2. Create Invoice:
a. Implement invoice creation functionality in accordance with the API specifications provided in
Appendix A.
b. Create a form that allows users to enter invoice details.
c. Each invoice should contain a single line item only.
d. Implement validation for all relevant invoice fields.
e. Submit the invoice data via the provided API endpoint. Upon successful submission, display a
confirmation message notifying the user that the invoice has been created successfully.

Sample
curl --location 'https://api-neobank-dev.101digital.io/invoice-service/1.0.0/invoices' \
--header 'org-token:
eyJhbGciOiJIUzI1NiJ9.eyJvcmdOYW1lIjoiUnVrc2hhbiBTRCIsImlzcyI6ImludGVybmFsIiwiaH
R0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvYXBwbGljYXRpb25uYW1lIjoiMTAxRFBheUFwc
CIsIm1lbWJlcnNoaXBJZCI6ImU3OGU4M2JiLTViNjYtNDIyNi1hM2JhLWE1NTRhMTU1MzQ
1ZCIsImV4cCI6MTcyOTc4MDc0MSwidXNlcklkIjoiNmRlMjM4ZTgtZjc0Mi00NTQyLWEwZW
MtYjljNGEwNjlhZWMwIiwib3JnSWQiOiIxMGNhMThmMS0xMTczLTQ2MzQtOTgxNy1iZDIz
MmNlNDgwMTUiLCJsaXN0Um9sZXMiOlsiT3JnYW5pc2F0aW9uT3duZXIiXSwiaHR0cDpcL
1wvd3NvMi5vcmdcL2NsYWltc1wvZW50aXR5SWQiOiIxMDFEIn0.odjAWDUHB5gsn48-
N2ADfwwfDhZckLlTLfEpTXcpl98' \
--header 'Operation-Mode: SYNC' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer
eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1
TVdSbFpEZzROemM0WkEiLCJraWQiOiJNell4TW1Ga09HWXdNV0kwWldObU5EY3hOR1l
3WW1NNFpUQTNNV0kyTkRBelpHUXpOR00wWkdSbE5qSmtPREZrWkRSaU9URmtNV0Z
oTXpVMlpHVmxOZ19SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzZTE2Y2VmZC01NjczLT
RjZGItOGQ3Yy04YzJhZTg1MWVjNTMiLCJhdXQiOiJBUFBMSUNBVElPTl9VU0VSIiwib3Jn
YW5pc2F0aW9uSWQiOiIxMGNhMThmMS0xMTczLTQ2MzQtOTgxNy1iZDIzMmNlNDgwMT
UiLCJpc3MiOiJodHRwczpcL1wvaXMtMTAxZGlnaXRhbC1zYW5kYm94LjEwMWRpZ2l0YW
wuaW86NDQzXC9vYXV0aDJcL3Rva2VuIiwiZ3JvdXBzIjpbIkludGVybmFsXC9ldmVyeW9uZ
SIsIkludGVybmFsXC9zZWxmc2lnbnVwIl0sImdpdmVuX25hbWUiOiJSdWtzaGFuIiwiYXVkIjoi
djNWODdaSXFqZFVNblFsZjR5djdlVzNrMWFBYSIsIm5iZiI6MTcyOTc3Njk1MiwiYXpwIjoidjN
WODdaSXFqZFVNblFsZjR5djdlVzNrMWFBYSIsInNjb3BlIjoib3BlbmlkIiwiZXhwIjoxNzI5Nzgw
NTUyLCJpYXQiOjE3Mjk3NzY5NTIsImZhbWlseV9uYW1lIjoiUktTIiwianRpIjoiMmY2OTQ3Yz
gtOTM5NC00MDIwLTg3NGQtNmU2ZmE3NDExOTNkIn0.KICy6vlGYhkW3M-
S8huhYBlW0fC4eGo0luuT9MqeTFju4uVnnsPJIt0dEUH5BPz7xSNfJWEYcVX4fWumTmVgl
hCJFN44FK51mSPNKFUZX57fg3D6ZLQnKj5WwMDe5B3BIoDpu8Z8NK3IBv3iO6H_ph_B
WXN4re1XGOoZbMMuUuFKVn0UtnuXjB1_IzGvKXnsuMEsTslbDcG0ewZwpK5cJrXHZ_zjs
Z-Llszpye6K0sEgwFyj0U1AEjKt0KgMFtDEKmKuHoCnzopaNOK3TCa5Xe6zD8NMP-
IqtqYq8uPVVsiyiLG_YHMOe0J98jKMNy1-uNMwJyNRAdiEnYu4uTLr1g' \
--data-raw '{
"invoices": [
Copyright 2021-2026 101 Digital PTE LTD Version:2.2.4 Page 12 of 14
{
"bankAccount": {
"bankId": "",
"sortCode": "09-01-01",
"accountNumber": "12345678",
"accountName": "John Terry"
},
"customer": {
"firstName": "Nguyen",
"lastName": "Dung 2",
"contact": {
"email": "nguyendung2@101digital.io",
"mobileNumber": "+6597594971"
},
"addresses": [
{
"premise": "CT11",
"countryCode": "VN",
"postcode": "1000",
"county": "hoangmai",
"city": "hanoi",
"addressType": "BILLING"
}
]
},
"documents": [
{
"documentId": "96ea7d60-89ed-4c3b-811c-d2c61f5feab2",
"documentName": "Bill",
"documentUrl": "http://url.com/#123"
}
],
"invoiceReference": "#123456",
"invoiceNumber": "INV123456701",
"currency": "GBP",
"invoiceDate": "2021-05-27",
"dueDate": "2021-06-04",
"description": "Invoice is issued to Akila Jayasinghe",
"customFields": [
{
"key": "invoiceCustomField",
"value": "value"
}
],
"extensions": [
{
"addDeduct": "ADD",
"value": 10,
Copyright 2021-2026 101 Digital PTE LTD Version:2.2.4 Page 13 of 14
"type": "PERCENTAGE",
"name": "tax"
},
{
"addDeduct": "DEDUCT",
"type": "FIXED_VALUE",
"value": 10.00,
"name": "discount"
}
],
"items": [
{
"itemReference": "itemRef",
"description": "Honda RC150",
"quantity": 1,
"rate": 1000,
"itemName": "Honda Motor",
"itemUOM": "KG",
"customFields": [
{
"key": "taxiationAndDiscounts_Name",
"value": "VAT"
}
],
"extensions": [
{
"addDeduct": "ADD",
"value": 10,
"type": "FIXED_VALUE",
"name": "tax"
},
{
"addDeduct": "DEDUCT",
"value": 10,
"type": "PERCENTAGE",
"name": "tax"
}
]
}
]
}
]
}