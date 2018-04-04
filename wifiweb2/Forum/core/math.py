class mathCore:
    def __init__(self):
        pass

    def plusRange(self, data, row=True):
        data = sorted(data)
        max = data[len(data) - 1] * 2 - 1
        exclude = []
        if not row:
            i = 0;
            while (1 << i) <= data[len(data) - 1]:
                if 1 << i not in data:
                    for j in range(1, max + 1):
                        if j & 1 << i:
                            exclude.append(j)
                            continue
                i = i + 1
        data = []
        for i in range(1, max + 1):
            data.append(i)
        return list(set(data) - set(exclude))

    def decom(self, data):
        i = 0
        result = []
        while (1 << i) - 1 < data:
            if data & 1 << i:
                result.append(1 << i)
            i = i + 1
        return result

    def plus(self, data):
        result = 0;
        for v in data:
            result = result + v
        return result;