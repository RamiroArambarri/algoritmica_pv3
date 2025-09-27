precision highp float;
precision highp int;

float hue2rgb(float f1, float f2, float hue) {
    if(hue < 0.0)
        hue += 1.0;
    else if(hue > 1.0)
        hue -= 1.0;
    float res;
    if((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if((2.0 * hue) < 1.0)
        res = f2;
    else if((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 rgb2hsl(vec3 c) {
    float maxC = max(max(c.r, c.g), c.b);
    float minC = min(min(c.r, c.g), c.b);
    float delta = maxC - minC;

    float h = 220.0 / 360.;
    float s = 0.0;
    float l = (maxC + minC) * 0.5;

    if(delta > 0.00001) {
        s = delta / (1.0 - abs(2.0 * l - 1.0));

        if(maxC == c.r) {
            h = mod((c.g - c.b) / delta, 6.0);
        } else if(maxC == c.g) {
            h = (c.b - c.r) / delta + 2.0;
        } else {
            h = (c.r - c.g) / delta + 4.0;
        }

        h /= 6.0;
    }

    return vec3(h, s, l);
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;

    if(hsl.y == 0.0) {
        rgb = vec3(hsl.z);
    } else {
        float f2;

        if(hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;

        float f1 = 2.0 * hsl.z - f2;

        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0 / 3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0 / 3.0));
    }
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}