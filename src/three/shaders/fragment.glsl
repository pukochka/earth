uniform sampler2D globeTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main(){
    float intensivity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);

    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensivity, 1.5);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}