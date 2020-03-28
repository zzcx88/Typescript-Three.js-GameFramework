struct VS_BILLBOARD_INSTANCING_INPUT
{
	float3 position : POSITION;
	float2 uv : TEXCOORD;
	float3 instancePosition : INSTANCEPOSITION;
	float4 billboardInfo : BILLBOARDINFO; //(cx, cy, type, texture)
};

struct VS_BILLBOARD_INSTANCING_OUTPUT
{
	float4 position : SV_POSITION;
	float2 uv : TEXCOORD;
	int textureID : TEXTUREID;
};

VS_BILLBOARD_INSTANCING_OUTPUT VSBillboardInstancing(VS_BILLBOARD_INSTANCING_INPUT input)
{
	VS_BILLBOARD_INSTANCING_OUTPUT output;

	if (input.position.x < 0.0f) input.position.x = -(input.billboardInfo.x * 0.5f);
	else if (input.position.x > 0.0f) input.position.x = (input.billboardInfo.x * 0.5f);
	if (input.position.y < 0.0f) input.position.y = -(input.billboardInfo.y * 0.5f);
	else if (input.position.y > 0.0f) input.position.y = (input.billboardInfo.y * 0.5f);

	float3 f3Look = normalize(gvCameraPosition - input.instancePosition);
	float3 f3Up = float3(0.0f, 1.0f, 0.0f);
	float3 f3Right = normalize(cross(f3Up, f3Look));

	matrix mtxWorld;
	mtxWorld[0] = float4(f3Right, 0.0f);
	mtxWorld[1] = float4(f3Up, 0.0f);
	mtxWorld[2] = float4(f3Look, 0.0f);
	mtxWorld[3] = float4(input.instancePosition, 1.0f);

	output.position = mul(mul(mul(float4(input.position, 1.0f), mtxWorld), gmtxView), gmtxProjection);

	output.uv = input.uv;

	output.textureID = (int)input.billboardInfo.w - 1;

	return(output);
}

Texture2D<float4> gtxtBillboardTextures[7] : register(t14);

float4 PSBillboardInstancing(VS_BILLBOARD_INSTANCING_OUTPUT input) : SV_TARGET
{
	float4 cColor = gtxtBillboardTextures[NonUniformResourceIndex(input.textureID)].Sample(gWrapSamplerState, input.uv);

	return(cColor);
}