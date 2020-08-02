#include "Shaders.hlsl"

cbuffer cbGameObjectInfo : register(b2)
{
	matrix		gmtxWorld : packoffset(c0);
	uint		gnMaterialID : packoffset(c8);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
Texture2D gtxtTexture : register(t0);

struct VS_TEXTURED_INPUT
{
	float3 position : POSITION;
	float2 uv : TEXCOORD;
};

struct VS_TEXTURED_OUTPUT
{
	float4 position : SV_POSITION;
	float2 uv : TEXCOORD;
};

VS_TEXTURED_OUTPUT VSTextured(VS_TEXTURED_INPUT input)
{
	VS_TEXTURED_OUTPUT output;

	output.position = mul(mul(float4(input.position, 1.f), gmtxWorld),gmtxOrthProjection);
	output.uv = input.uv;

	return(output);
}

float4 PSTextured(VS_TEXTURED_OUTPUT input, uint primitiveID : SV_PrimitiveID) : SV_TARGET
{
	float4 cColor = gtxtTexture.Sample(gssWrap, input.uv);
	clip(cColor.a - 0.03f);
	
	//clip(cColor.a - gfalpha);
	if (gbWarning == true)
	{
		cColor.r += 0.9f;
		cColor.g = 0.2f;
		cColor.b = 0.2f;

	}
	
	return(cColor);
}